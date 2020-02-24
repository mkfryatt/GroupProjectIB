package main.java.data;

public abstract class WishConstraint {
  public enum Type {
    LOCATION,
    ORGANISATION,
    TIME
  }

  public int id;
  public Type type;
  public Wish wish;

  public WishConstraint(int id, Type type, Wish wish){
    this.id = id;
    this.type = type;
    this.wish = wish;
  }

  public abstract boolean meetsRequirement(Trip trip);
}
