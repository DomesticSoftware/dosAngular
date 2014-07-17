using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MvcAppBasic.Models
{
    public class Pager
    {
        /// <summary>
        /// Flag για το αν θα εκτελέσουμε το data.Count()
        /// </summary>
        public Boolean DontRefreshCount { get; set; }
        /// <summary>
        /// Πόσες εγγραφές έχει το DataSet
        /// </summary>
        public Int32 RowsCount { get; set; }

        /// <summary>
        /// Ποιά ειναι η ενεργή σελίδα 
        /// </summary>
        public Int32 PageNo { get; set; }

        /// <summary>
        /// Πόσες σελίδες εμφανίζονται στον client
        /// </summary>
        public Int32 VisiblePages { get; set; }

        /// <summary>
        /// Πόσες σελίδες έχει ο Pager, Μόνο οι αριθμητικές
        /// </summary>
        public Int32 PagesCount{ get; set; }

        /// <summary>
        /// Το πλήθος των σελίδων που έχει το DataSet
        /// </summary>
        public List<Int32> Pages { get; set; }

        /// <summary>
        /// Πόσες εγγραφές έχουμε ανα σελίδα
        /// </summary>
        public Int32 PageSize { get; set; }

        public Int32 FirstVisiblePage { get; set; }
        public Int32 LastVisiblePage { get; set; }

        public Pager()
        {
            if (Pages == null)
            {
                Pages = new List<Int32>();
                PageNo = 1;
                PageSize = 10;
                VisiblePages = 5;
            }
        }

        public DataTableInfo DoPaging(IEnumerable<object> data, IEnumerable<object> pagedData)
        {
            Pages = new List<Int32>();

            if (DontRefreshCount == false)
            {
                DontRefreshCount = true;
                PageNo = 1;
                RowsCount = data.Count();

                PagesCount = (Int32)Math.Ceiling(RowsCount / (decimal)PageSize);
            }

            Int32 PagesGroups = (Int32)Math.Ceiling(Pages.Count / (decimal)VisiblePages);
            Int32 CurrentPageGroup = (Int32)((PageNo - 1) / (decimal)VisiblePages);

            FirstVisiblePage = (CurrentPageGroup * VisiblePages) + 1;
            LastVisiblePage = (FirstVisiblePage - 1) + VisiblePages;
            if (LastVisiblePage > PagesCount) LastVisiblePage = PagesCount;


            Pages.Add(-10);
            Pages.Add(-11);

            for (Int32 i = 0; i < (LastVisiblePage - FirstVisiblePage) + 1; i++)
            {
                Pages.Add(i + 1);
            }

            Pages.Add(-21);
            Pages.Add(-20);

            return new DataTableInfo() { Pager = this, Data = pagedData.ToList() };
        }
    }

    public class Page
    {
        public Int32 Id { get; set; }
        /// <summary>
        /// Type: 0 -> Είναι Σελίδα Αριθμός
        /// Type: -10 -> Είναι η Αρχική Σελίδα
        /// Type: -11 -> Είναι η προηγούμενη σελίδα
        /// Type: -12 -> Είναι η προηγούμενη ομάδα σελίδων
        /// Type: -20 -> Είναι η Τελευταία Σελίδα
        /// Type: -21 -> Είναι η επόμενη σελίδα
        /// Type: -22 -> Είναι η επόμενη ομάδα σελίδων
        /// </summary>
        public Int32 Type { get; set; }
    }

    public class DataTableInfo
    {
        public Pager Pager { get; set; }
        public IEnumerable<object> Data { get; set; }
    }
}