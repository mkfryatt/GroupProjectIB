package main.java.data;

public class LocationConstraint extends WishConstraint {

  private final double co2PerKM = 0.115;

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
