using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Configuration;
using System.Data.SqlClient;
using System.Text;
using System.Data;
using System.Text.RegularExpressions;

namespace WebApplication1.Models.DAL
{


    public class DataServices
    {
        public SqlDataAdapter da;
        public DataTable dt;


        public SqlConnection connect(String conString)
        {

            // read the connection string from the configuration file
            string cStr = WebConfigurationManager.ConnectionStrings[conString].ConnectionString;
            SqlConnection con = new SqlConnection(cStr);
            con.Open();
            return con;
        }

        public int Insert(Object obj)
        {
            SqlConnection con;
            SqlCommand cmd;

            try
            {
                con = connect("DBConnectionString"); // create the connection
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }

            String cStr = BuildInsertCommand(obj);      // helper method to build the insert string

            cmd = CreateCommand(cStr, con);             // create the command

            try
            {
                int numEffected = cmd.ExecuteNonQuery(); // execute the command
                return numEffected;
            }
            catch (SqlException ex)
            {
                //To check if there is viaolation of mult emails of keys
                if (ex.Number == 2627 || ex.Number == 2601)
                {
                    return -1;
                }
                else throw;
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }

            finally
            {
                if (con != null)
                {
                    // close the db connection
                    con.Close();
                }
            }

        }

        //Take the object and pass it to the SQL
        private String BuildInsertCommand(Object obj)
        {
            StringBuilder sb = new StringBuilder();

            String prefix = "";

            String commandPref = "";
            Regex r = new Regex(@"('|\(|\))", RegexOptions.IgnoreCase | RegexOptions.CultureInvariant | RegexOptions.Compiled);


            //Create an object in a generic way so that the method will be written once.
            if (obj is Episode)
            {
                Episode ep = obj as Episode;
                sb.AppendFormat("Values('{0}', '{1}', '{2}', '{3}', '{4}', '{5}', '{6}')", ep.Id, ep.Id_ser, r.Replace(ep.EpName, ""), r.Replace(ep.SerName, ""), ep.SeasonNum, ep.Img, r.Replace(ep.Description, ""));
                prefix = "INSERT INTO Episodes_2021 " + "([id], [id_ser] , [name], [sername], [season_num], [image], [description]) ";
                commandPref = "INSERT INTO Preferences_2021 " + "([id_ep], [id_user]) " + "Values(" + ep.Id.ToString() + "," + ep.Id_user.ToString() + ")";
            }
            else if (obj is Serie)
            {
                Serie ser = obj as Serie;
                sb.AppendFormat("Values('{0}', '{1}', '{2}', '{3}', '{4}', '{5}', '{6}', '{7}')", ser.Id, ser.First_air_date, ser.Name, ser.Origin_country, ser.Original_language, r.Replace(ser.Overview, ""), ser.Popularity, ser.Poster_path);
                prefix = "INSERT INTO Series_2021 " + "([id], [first_air_date], [name], [origin_country], [original_language], [overview], [popularity], [poster_path]) ";
            }


            else
            {
                User u = obj as User;
                sb.AppendFormat("Values('{0}', '{1}', '{2}', '{3}', '{4}', '{5}', '{6}', '{7}', '{8}')", u.Name, u.Sername, u.Mail, u.Pass, u.Phone, u.Gender, u.BirthYear, u.FavGenre, u.Address);
                prefix = "INSERT INTO Users_2021 " + "([name], [sername], [email], [Password], [phone], [gender], [birth_year], [fav_genre], [address]) ";
            }

            String command;

            // use a string builder to create the dynamic string

            command = prefix + sb.ToString();

            return command + commandPref;
        }
        //---------------------------------------------------------------------------------
        // Create the SqlCommand
        //---------------------------------------------------------------------------------
        private SqlCommand CreateCommand(String CommandSTR, SqlConnection con)
        {

            SqlCommand cmd = new SqlCommand(); // create the command object

            cmd.Connection = con;              // assign the connection to the command object

            cmd.CommandText = CommandSTR;      // can be Select, Insert, Update, Delete 

            cmd.CommandTimeout = 10;           // Time to wait for the execution' The default is 30 seconds

            cmd.CommandType = System.Data.CommandType.Text; // the type of the command, can also be stored procedure

            return cmd;
        }

        //GET user while login --> check validity of password and email inserted
        public User GetU(string mail, string password)
        {
            SqlConnection con = null;

            try
            {
                con = connect("DBConnectionString"); // create a connection to the database using the connection String defined in the web config file

                String selectSTR = "SELECT U.id, U.name, U.sername, U.email, U.phone, U.gender, U.birth_year, U.fav_genre, U.address FROM Users_2021 U WHERE U.email LIKE '" + mail + "' AND U.password LIKE '" + password + "'";
                SqlCommand cmd = new SqlCommand(selectSTR, con);

                // get a reader
                SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.CloseConnection); // CommandBehavior.CloseConnection: the connection will be closed after reading has reached the end
                User u = new User();

                //Break in the end - suppose to return 1 or 0 rows
                while (dr.Read())
                {   // Read till the end of the data into a row
                    u.Id = Convert.ToInt32(dr["id"]);
                    u.Name = (string)dr["name"];
                    u.Sername = (string)dr["sername"];
                    u.Mail = (string)dr["email"];
                    u.Phone = (string)dr["phone"];
                    u.Gender = Convert.ToChar(dr["gender"]);
                    u.BirthYear = Convert.ToInt32(dr["birth_year"]);
                    u.FavGenre = (string)dr["fav_genre"];
                    u.Address = (string)dr["address"];
                    break;
                }
                return u;

            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }

            }

        }

        public List<Serie> GetSerPref(int uId)
        {

            SqlConnection con = null;
            List<Serie> serList = new List<Serie>();
            try
            {
                con = connect("DBConnectionString"); // create a connection to the database using the connection String defined in the web config file

                String selectSTR = "SELECT DISTINCT S.id, S.name FROM Preferences_2021 P inner join Episodes_2021 E on P.id_ep = E.id inner join Series_2021 S on E.id_ser = S.id WHERE P.id_user = " + uId;
                SqlCommand cmd = new SqlCommand(selectSTR, con);

                // get a reader
                SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.CloseConnection); // CommandBehavior.CloseConnection: the connection will be closed after reading has reached the end

                while (dr.Read())
                {   // Read till the end of the data into a row
                    Serie ser = new Serie();
                    ser.Id = (int)(dr["id"]);
                    ser.Name = (string)(dr["name"]);
                    serList.Add(ser);
                }

                return serList;
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }

            }

        }

        public List<Episode> GetEpPref(int uId, int sId)
        {

            SqlConnection con = null;
            List<Episode> episodeList = new List<Episode>();

            try
            {
                con = connect("DBConnectionString"); // create a connection to the database using the connection String defined in the web config file

                String selectSTR = "SELECT E.* FROM Preferences_2021 P inner join Episodes_2021 E on P.id_ep = E.id inner join Series_2021 S on E.id_ser = S.id WHERE P.id_user =" + uId + " AND S.id = " + sId;
                SqlCommand cmd = new SqlCommand(selectSTR, con);

                // get a reader
                SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.CloseConnection); // CommandBehavior.CloseConnection: the connection will be closed after reading has reached the end

                while (dr.Read())
                {   // Read till the end of the data into a row
                    Episode ep = new Episode();


                    ep.Id = (int)(dr["id"]);
                    ep.Id_ser = (int)(dr["id_ser"]);
                    ep.EpName = (string)dr["name"];
                    ep.SerName = (string)dr["sername"];
                    ep.SeasonNum = Convert.ToInt32(dr["season_num"]);
                    ep.Img = (string)dr["image"];
                    ep.Description = (string)dr["description"];

                    episodeList.Add(ep);
                }

                return episodeList;
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }

            }

        }


        //GET users List for admin
        public List<User> GetUList()
        {
            SqlConnection con = null;

            try
            {
                con = connect("DBConnectionString"); // create a connection to the database using the connection String defined in the web config file

                String selectSTR = "SELECT * FROM Users_2021";
                SqlCommand cmd = new SqlCommand(selectSTR, con);

                // get a reader
                SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.CloseConnection); // CommandBehavior.CloseConnection: the connection will be closed after reading has reached the end
                List<User> uList = new List<User>();

                //Break in the end - suppose to return 1 or 0 rows
                while (dr.Read())
                {   // Read till the end of the data into a row
                    User u = new User();
                    u.Id = Convert.ToInt32(dr["id"]);
                    u.Name = (string)dr["name"];
                    u.Sername = (string)dr["sername"];
                    u.Mail = (string)dr["email"];
                    u.Phone = (string)dr["phone"];
                    u.Gender = Convert.ToChar(dr["gender"]);
                    u.BirthYear = Convert.ToInt32(dr["birth_year"]);
                    u.FavGenre = (string)dr["fav_genre"];
                    u.Address = (string)dr["address"];
                    uList.Add(u);
                }
                return uList;

            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }

            }

        }
    }

}