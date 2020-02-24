package main.java.data;

public class Suggestion {
  public int id;
  public Wish wish;
  public Trip trip;
  public UnepPresence unepPresence;
  public Presence orgPresence;
  public double score;

  public Suggestion(int id, Wish wish, Trip trip, double score) {
    this.id = id;
    this.wish = wish;
    this.trip = trip;

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


  public double getScore() {
    return score;
  }

  public void setScore(double score) {
    this.score = score;
  }
}
