using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using MvcAppBasic.Models;

namespace MvcAppBasic.Controllers
{
    public class HomeController : Controller
    {
        //
        // GET: /Home/

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult CustomersIndex()
        {   
            return View();
        }

        public ActionResult DashBoardIndex()
        {
            return View();
        }

        public ActionResult GetSelect2Data(String term)
        {
            List<Customers> Data = new List<Customers>();
            Data.Add(new Customers() { Id = 1, eMail = "antonis_saridakis@hotmail.com", UserName = "asaridakis" });
            Data.Add(new Customers() { Id = 2, eMail = "antonis_saridakis@hotmail.com2", UserName = "asaridakis2" });
            
            return Json(Data.Select(f => new { id = f.Id, text = f.eMail }), JsonRequestBehavior.AllowGet);            
        }
        
        [HttpPost]
        public ActionResult GetTableData(String term, Pager pager)
        {
            List<Customers> Data = new List<Customers>();
            Data.Add(new Customers() { Id = 1, eMail = "antonis_saridakis@hotmail.com", UserName = "asaridakis" });
            Data.Add(new Customers() { Id = 2, eMail = "antonis_saridakis@hotmail.com2", UserName = "asaridakis2" });
            Int32 i = 3;
            while(i++ < 200)
            {
                Data.Add(new Customers() { Id = i, eMail = "antonis_saridakis@hotmail.com" + i.ToString(), UserName = "asaridakis" + i.ToString() });
            }

            Data.Add(new Customers() { Id = i + 900, eMail = "antonis_saridakis@hotmail.com__LastRow", UserName = "asaridakis_LastRow" });

            //var pData = (from items in Data select items);

            return Json(pager.DoPaging(Data), JsonRequestBehavior.AllowGet);
        }

    }

    public class Customers
    {
        public Int32 Id { get; set; }
        public String eMail { get; set; }
        public String UserName { get; set; }
    }
}
