using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WebApplication1.Models.DAL;

namespace WebApplication1.Models
{
    public class Serie
    {
        int id;
        string first_air_date;
        string name;
        string origin_country;
        string original_language;
        string overview;
        float popularity;
        string poster_path;

        public int Id { get => id; set => id = value; }
        public string First_air_date { get => first_air_date; set => first_air_date = value; }
        public string Name { get => name; set => name = value; }
        public string Origin_country { get => origin_country; set => origin_country = value; }
        public string Original_language { get => original_language; set => original_language = value; }
        public string Overview { get => overview; set => overview = value; }
        public float Popularity { get => popularity; set => popularity = value; }
        public string Poster_path { get => poster_path; set => poster_path = value; }



        //Insert series to DB
        public int Insert()
        {
            DataServices ds = new DataServices();
            ds.Insert(this);
            return 1;
        }

        public List<Serie> Get(int uId, string type)
        {
            DataServices ds = new DataServices();
            return ds.GetSerPref(uId, type);
        }

        public int CheckPref(int uId, int sId)
        {
            DataServices ds = new DataServices();
            return ds.CheckSerPref(uId, sId);
        }
    }
}