using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

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

        public ActionResult GetTableData(String term)
        {
            List<Customers> Data = new List<Customers>();
            Data.Add(new Customers() { Id = 1, eMail = "antonis_saridakis@hotmail.com", UserName = "asaridakis" });
            Data.Add(new Customers() { Id = 2, eMail = "antonis_saridakis@hotmail.com2", UserName = "asaridakis2" });

            return Json(Data, JsonRequestBehavior.AllowGet);
        }

    }

    public class Customers
    {
        public Int32 Id { get; set; }
        public String eMail { get; set; }
        public String UserName { get; set; }
    }
}
