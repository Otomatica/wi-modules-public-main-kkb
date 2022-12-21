create table temip (
  id int not null auto_increment,
  eventDetectorId int not null,
  priority int,
  alarmState int,
  source varchar(100),
  category varchar(100),
  alarmText varchar(255),
  timestamp varchar(50) not null,
  address varchar(50) not null,
  port int not null,
  trapStatus varchar(10),
  primary key (id)
);
alter table temip add constraint temipFk foreign key(eventDetectorId) references eventDetectors (id) on delete cascade;
create index alarmState on temip (alarmState asc);