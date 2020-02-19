package data;

public class Suggestion {
  public int id;
  public Wish wish;
  public Trip trip;
  public Location loc;
  public int startTime,endTime;
  public double score;

  public Suggestion(int id, Wish wish, Trip trip, Location loc, int startTime, int endTime, double score) {
    this.id = id;
    this.wish = wish;
    this.trip = trip;
    this.loc = loc;
    this.startTime = startTime;
    this.endTime = endTime;
    this.score = score;
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

  public int getStartTime() {
    return startTime;
  }

  public void setStartTime(int startTime) {
    this.startTime = startTime;
  }

  public int getEndTime() {
    return endTime;
  }

  public void setEndTime(int endTime) {
    this.endTime = endTime;
  }

  public double getScore() {
    return score;
  }

  public void setScore(double score) {
    this.score = score;
  }
}
