﻿using System;
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
       

        public int Insert()
        {
            DataServices ds = new DataServices();  
            return ds.Insert(this);
        }
     

        public List<Episode> Get(int uId, int sId)
        {
            DataServices ds = new DataServices();
            return ds.GetEpPref(uId, sId);
        }

        //public List<Episode> Get()
        //{
        //    DataServices ds = new DataServices();
        //    return ds.GetEps();
        //}

    }
   
}