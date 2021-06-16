CREATE TABLE [Users_2021] (
    [id]         SMALLINT      IDENTITY (1, 1) NOT NULL,
    [name]       NVARCHAR (30) NOT NULL,
    [email]      VARCHAR (250) NOT NULL,
    [password]   NVARCHAR (30) NOT NULL,
    [phone]      VARCHAR (11)  NOT NULL,
    [gender]     CHAR (1)      NOT NULL,
    [birth_year] INT           NOT NULL,
    [fav_genre]  VARCHAR (15)   NULL,
    [address]    NVARCHAR (80) NOT NULL,
    PRIMARY KEY  (id),
    UNIQUE  (email )
);

