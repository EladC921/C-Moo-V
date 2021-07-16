using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WebApplication1.Models.DAL;

namespace WebApplication1.Models
{
    public class Preference
    {
        string serName;
        string epName;
        int numOfUsers;

        public string SerName { get => serName; set => serName = value; }
        public string EpName { get => epName; set => epName = value; }
        public int NumOfUsers { get => numOfUsers; set => numOfUsers = value; }

        //GET num of users that like specific episode or certain series 
        public List<Preference> Get(string type)
        {
            DataServices ds = new DataServices();
            return ds.GetTotalPref(type);
        }
    }
}