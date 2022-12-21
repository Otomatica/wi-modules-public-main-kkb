create table temip (
  id int not null auto_increment,
  eventDetectorId int not null,
  priority int,
  alarmState int,
  source nvarchar(100),
  category nvarchar(100),
  alarmText nvarchar(255),
  timestamp nvarchar(50) not null,
  address nvarchar(50) not null,
  port int not null,
  trapStatus nvarchar(10)
);
alter table temip add constraint temipFk foreign key (eventDetectorId) references eventDetectors(id) on delete cascade;
create index alarmState on temip (alarmState asc);