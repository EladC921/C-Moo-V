CREATE TABLE [Preferences_2021] (
    [id_ep]   SMALLINT NOT NULL,
    [id_user] SMALLINT NOT NULL,
    PRIMARY KEY (id_ep , id_user ),
    FOREIGN KEY (id_user) REFERENCES [Users_2021] (id)
);