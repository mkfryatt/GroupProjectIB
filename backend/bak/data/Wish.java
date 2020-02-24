package data;

import java.util.ArrayList;
import java.util.List;

public class Wish {
  int id;
  Timeframe time;
  ArrayList<WishConstraint> constraints;

  public Wish(int id, Timeframe time, List<WishConstraint> constraints) {
    this.id = id;
    this.time = time;
    this.constraints = new ArrayList<>(constraints);
  }

  public Wish(){
    this.constraints = new ArrayList<>();
  }

  public int getId() {
    return id;
  }

  public void setId(int id) {
    this.id = id;
  }

  public Timeframe getTime() {
    return time;
  }

  public void setTime(Timeframe time) {
    this.time = time;
  }

  public ArrayList<WishConstraint> getConstraints() {
    return constraints;
  }

  public void setConstraints(ArrayList<WishConstraint> constraints) {
    this.constraints = constraints;
  }
}
