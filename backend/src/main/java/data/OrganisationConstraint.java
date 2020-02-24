package main.java.data;

public class OrganisationConstraint extends WishConstraint {

  public Organisation org;

  public OrganisationConstraint(int id, Wish wish, Organisation org) {
    super(id, Type.ORGANISATION, wish);
    this.org = org;
  }

  @Override
  public boolean meetsRequirement(Trip trip) {
    return trip.presentOrgs.contains(org);
  }
}
