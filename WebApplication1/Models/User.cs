using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WebApplication1.Models.DAL;

namespace WebApplication1.Models
{
    public class User
    {
        int id;
        string name;
        string sername;
        string mail;
        string pass;
        string phone;
        char gender;
        int birthYear;
        string favGenre;
        string address;

        public int Id { get => id; set => id = value; }
        public string Name { get => name; set => name = value; }
        public string Sername { get => sername; set => sername = value; }
        public string Mail { get => mail; set => mail = value; }
        public string Pass { get => pass; set => pass = value; }
        public string Phone { get => phone; set => phone = value; }
        public char Gender { get => gender; set => gender = value; }
        public int BirthYear { get => birthYear; set => birthYear = value; }
        public string FavGenre { get => favGenre; set => favGenre = value; }
        public string Address { get => address; set => address = value; }

        public int Insert()
        {
            DataServices ds = new DataServices();
            int numOfEffected = ds.Insert(this);

            return numOfEffected;
        }


        public User Get(string mail, string password)
        {
            DataServices ds = new DataServices();
            return ds.GetU(mail, password);
        }

        public List<User> GetUList()
        {
            DataServices ds = new DataServices();
            return ds.GetUList();
        }
    }
}