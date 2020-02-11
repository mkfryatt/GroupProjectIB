package data;

public class Presence {
  public int id;
  public Organisation org;
  public Location loc;
  public Timeframe time;

  public Presence(int id, Organisation org, Location loc, Timeframe time) {
    this.id = id;
    this.org = org;
    this.loc = loc;
    this.time = time;
  }
}
