CREATE TABLE [Episodes_2021] (
    [id]          INT            NOT NULL,
    [id_ser]      INT            NOT NULL,
	[name]        NVARCHAR (100) NOT NULL,
    [sername]     NVARCHAR (100) NOT NULL,
    [season_num]  INT            NOT NULL,
    [image]       TEXT           NULL,
    [description] NTEXT          NULL,
    PRIMARY KEY  (id,id_ser),
    FOREIGN KEY (id_ser) REFERENCES [Series_2021] (id)
);
