package main.java.data;

import java.util.ArrayList;
import java.util.List;
import main.java.data.OrganisationConstraint;
import main.java.data.Timeframe;

public class Wish {
  int id;
  public UnepRep wisher;
  public ArrayList<OrganisationConstraint> orgConstraints;
  public LocationConstraint locConstraint;
  public TimeConstraint timeConstraint;

  public Wish(int id, UnepRep wisher) {
    this.id = id;
    this.wisher = wisher;
  }

  public Wish(){
    orgConstraints = new ArrayList<>();
  }

  public int getId() {
    return id;
  }

  public void setId(int id) {
    this.id = id;
  }

}
