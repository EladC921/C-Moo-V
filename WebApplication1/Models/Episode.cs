using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WebApplication1.Models.DAL;

namespace WebApplication1.Models
{
    public class Episode
    {
        int id;
        int id_user;
        int id_ser;
        string epName;
        string serName;
        int seasonNum;
        string img;
        string description;

        public int Id { get => id; set => id = value; }
        public int Id_user { get => id_user; set => id_user = value; }
        public int Id_ser { get => id_ser; set => id_ser = value; }
        public string EpName { get => epName; set => epName = value; }
        public string SerName { get => serName; set => serName = value; }
        public int SeasonNum { get => seasonNum; set => seasonNum = value; }
        public string Img { get => img; set => img = value; }
        public string Description { get => description; set => description = value; }
       
        //insert episode to DB
        public int Insert()
        {
            DataServices ds = new DataServices();  
            return ds.Insert(this);
        }

        //GET episodes based on user preferences of certain series 
        public List<Episode> Get(int uId, int sId)
        {
            DataServices ds = new DataServices();
            return ds.GetEpPref(uId, sId);
        }

        //DELETE episode from user preferences
        public void Remove(int uId, int eId) {
            DataServices ds = new DataServices();
            ds.RemoveEp(uId, eId);
        }
    }
   
}