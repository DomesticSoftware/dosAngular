using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MvcAppBasic.Models
{
    public class Pager
    {
        public Boolean ClientPaging { get; set; }
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
                FirstVisiblePage = 1;
            }
        }

        public DataTableInfo DoPaging(IEnumerable<object> data) //, IEnumerable<object> pagedData
        {
            Pages = new List<Int32>();


            if (DontRefreshCount == false)
            {
                DontRefreshCount = true;
                PageNo = 1;
                RowsCount = data.Count();

                PagesCount = (Int32)Math.Ceiling(RowsCount / (decimal)PageSize);
            }

            //Int32 PagesGroups = (Int32)Math.Ceiling(Pages.Count / (decimal)VisiblePages);
            //Int32 CurrentPageGroup = (Int32)((PageNo - 1) / (decimal)VisiblePages);
            Int32 tmpPageNo = PageNo;
            switch (PageNo)
            {
                case -10: //Είναι η Αρχική Σελίδα
                    FirstVisiblePage = 1;
                    tmpPageNo = 1;
                    break;
                case -11: //Είναι η προηγούμενη σελίδα
                    if (FirstVisiblePage > 1)
                    {
                        FirstVisiblePage--;
                        tmpPageNo = FirstVisiblePage;
                        //LastVisiblePage = (FirstVisiblePage - 1) + VisiblePages;
                    }
                    break;
                case -12: //Είναι η προηγούμενη ομάδα σελίδων
                    // 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16
                    //  [7 8 9 10 11]

                    if (FirstVisiblePage - VisiblePages > 0)
                    {
                        FirstVisiblePage -= VisiblePages;
                    }
                    else
                        FirstVisiblePage = 1;

                    tmpPageNo = FirstVisiblePage;
                    //LastVisiblePage = (FirstVisiblePage - 1) + VisiblePages;
                    break;
                
            }
            
            //FirstVisiblePage = (CurrentPageGroup * VisiblePages) + 1;
            LastVisiblePage = (FirstVisiblePage - 1) + VisiblePages;
            if (PageNo > 0)
            {
                if (PageNo == LastVisiblePage && LastVisiblePage < PagesCount)
                {
                    FirstVisiblePage++;
                    LastVisiblePage = (FirstVisiblePage - 1) + VisiblePages;
                }

                if (FirstVisiblePage > 1 && PageNo == FirstVisiblePage)
                {
                    FirstVisiblePage--;
                    LastVisiblePage = (FirstVisiblePage - 1) + VisiblePages;
                }
            }

            switch (PageNo)
            {
                case -20: //Είναι η Τελευταία Σελίδα
                    LastVisiblePage = PagesCount;
                    FirstVisiblePage = LastVisiblePage - VisiblePages;
                    if (FirstVisiblePage < 1) FirstVisiblePage = 1;
                    tmpPageNo = LastVisiblePage;
                    break;
                case -21: //Είναι η επόμενη σελίδα
                    FirstVisiblePage++;
                    LastVisiblePage = (FirstVisiblePage - 1) + VisiblePages;
                    tmpPageNo = LastVisiblePage;
                    break;
                case -22: //Είναι η επόμενη ομάδα σελίδων
                    // 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20
                    //  [15 16 17 18 19]

                    if (LastVisiblePage + VisiblePages < PagesCount)
                    {
                        LastVisiblePage += VisiblePages;
                    }
                    else
                        LastVisiblePage = PagesCount;

                    FirstVisiblePage = (LastVisiblePage - VisiblePages) + 1;
                    if (FirstVisiblePage < 1) FirstVisiblePage = 1;

                    tmpPageNo = LastVisiblePage;
                    break;
            }

            if (PageNo < 0)
                PageNo = tmpPageNo;

            if (LastVisiblePage > PagesCount) LastVisiblePage = PagesCount;

            Pages.Add(-10);
            Pages.Add(-12);

            for (Int32 i = FirstVisiblePage - 1; i < LastVisiblePage; i++)
            {
                Pages.Add(i + 1);
            }

            Pages.Add(-22);
            Pages.Add(-20);

            var pagedData = data.Skip((PageNo - 1) * PageSize).Take(PageSize).ToList();

            return new DataTableInfo() { Pager = this, Data = pagedData, AllData = ClientPaging ? data.ToList() : pagedData };
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
        public IEnumerable<object> AllData { get; set; }
    }
}