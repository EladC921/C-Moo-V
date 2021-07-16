using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WebApplication1.Models.DAL;

namespace WebApplication1.Models
{
    public class Actor
    {
        int id;
        int ser_id;
        string name;
        char gender;
        string profile_path;

        public int Id { get => id; set => id = value; }
        public int Ser_id { get => ser_id; set => ser_id = value; }
        public string Name { get => name; set => name = value; }
        public char Gender { get => gender; set => gender = value; }
        public string Profile_path { get => profile_path; set => profile_path = value; }

        //insert actors of series into DB
        public void Insert(List<Actor> actors)
        {
            DataServices ds = new DataServices();
            ds.InsertActors(actors);
        }
    }
}