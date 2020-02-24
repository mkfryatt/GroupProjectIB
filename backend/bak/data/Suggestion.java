package main.java.data;

public class Suggestion {
  public int id;
  public Wish wish;
  public Trip trip;
  public Location loc;
  public Timeframe time;

  public Suggestion(int id, Wish wish, Trip trip, Location loc, Timeframe time) {
    this.id = id;
    this.wish = wish;
    this.trip = trip;
    this.loc = loc;
    this.time = time;
  }

  public int getId() {
    return id;
  }

  public void setId(int id) {
    this.id = id;
  }

  public Wish getWish() {
    return wish;
  }

  public void setWish(Wish wish) {
    this.wish = wish;
  }

  public Trip getTrip() {
    return trip;
  }

  public void setTrip(Trip trip) {
    this.trip = trip;
  }

  public Location getLoc() {
    return loc;
  }

  public void setLoc(Location loc) {
    this.loc = loc;
  }

  public Timeframe getTime() {
    return time;
  }

  public void setTime(Timeframe time) {
    this.time = time;
  }


}
