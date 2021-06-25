using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace WebApplication1.Models
{
    public class EpisodesController : ApiController
    {
        // GET api/<controller>
        //public IEnumerable<Episode> Get()
        //{
        //    Episode ep = new Episode();
        //    return ep.Get();
        //}

        // GET api/<controller>/5
        public IEnumerable<Episode> Get(int uId, int sId)
        {
            Episode ep = new Episode();
            return ep.Get(uId, sId);
        }

        // POST api/<controller>
        public int Post([FromBody] Episode ep)
        {
          return ep.Insert();
         
        }

        // PUT api/<controller>/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/<controller>/5
        public void Delete(int uId, int eId)
        {
            Episode ep = new Episode();
            ep.Remove(uId, eId);
        }
    }
}