package main.java.data;

public class TimeConstraint extends WishConstraint implements Timeframe {

  public int startTime, endTime;

  public TimeConstraint(int id, Wish wish, int startTime, int endTime) {
    super(id, Type.TIME, wish);
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

  @Override
  public boolean meetsRequirement(Trip trip) {
    return this.overlaps(trip);
  }
}
