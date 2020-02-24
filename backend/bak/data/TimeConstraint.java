package data;

public class TimeConstraint extends WishConstraint {

  Timeframe time;

  public TimeConstraint(int id, Wish wish, Timeframe time) {
    super(id, Type.TIME, wish);
    this.time = time;
  }

  @Override
  public boolean meetsRequirement(Trip trip) {
    return this.time.overlaps(trip.time);
  }
}
