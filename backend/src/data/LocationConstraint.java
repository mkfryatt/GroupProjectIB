package data;

public class LocationConstraint extends WishConstraint {

  Location loc;

  public LocationConstraint(int id, Wish wish, Location loc) {
    super(id, Type.LOCATION, wish);
    this.loc = loc;
  }

  @Override
  public boolean meetsRequirement(Trip trip) {
    return trip.loc == this.loc;
  }
}
