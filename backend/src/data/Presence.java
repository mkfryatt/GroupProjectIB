package data;

public class Presence implements Timeframe{
  public int id;
  public Organisation org;
  public Location loc;
  public int startTime,endTime;

  public Presence(int id, Organisation org, Location loc, int startTime, int endTime) {
    this.id = id;
    this.org = org;
    this.loc = loc;
    this.startTime = startTime;
    this.endTime = endTime;
  }

  @Override
  public int getStartTime() {
    return startTime;
  }

  @Override
  public void setStartTime(int startTime) {
    this.startTime = startTime;
  }

  @Override
  public int getEndTime() {
    return endTime;
  }

  @Override
  public void setEndTime(int endTime) {
    this.endTime = endTime;
  }
}
