package data;

public abstract class WishConstraint {
  public enum Type {
    LOCATION,
    ORGANISATION,
    TIME
  }

  int id;
  Type type;
  Wish wish;

  public WishConstraint(int id, Type type, Wish wish){
    this.id = id;
    this.type = type;
    this.wish = wish;
  }

  public abstract boolean meetsRequirement(Trip trip);
}
