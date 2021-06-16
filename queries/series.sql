CREATE TABLE [Series_2021] (
    [id]                int          NOT NULL,
    [first_air_date]    DATE          ,
    [name]              NVARCHAR (90) NOT NULL ,
    [origin_country]    NVARCHAR (50) ,
    [original_language] NVARCHAR (50) ,
    [overview]          NTEXT         ,
    [popularity]        FLOAT (53)    ,
    [poster_path]       TEXT          ,
    PRIMARY KEY  (id)
);

