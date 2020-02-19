package data;

public class Timeframe {

  public int id;
  public int startTime, endTime;

  public Timeframe(int id, int startTime, int endTime) {
    this.startTime = startTime;
    this.endTime = endTime;
    this.id = id;
  }

  public Timeframe(int id) {
    this(id, 0, Integer.MAX_VALUE);
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

  public boolean overlaps(Timeframe other) {
    return this.startTime <= other.endTime && other.startTime <= this.endTime;
  }

  public int getId() {
    return id;
  }
}
