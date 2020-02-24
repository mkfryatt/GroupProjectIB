package main.java.data;

public class Location {
  public int id;
  public String name;
  public double lon, lat;

  public Location(int id, String name, double lon, double lat) {
    this.id = id;
    this.name = name;
    this.lon = lon;
    this.lat = lat;
  }

  public void setId(int id) {
    this.id = id;
  }

  public int getId() {
    return id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public double getLon() {
    return lon;
  }

  public void setLon(double lon) {
    this.lon = lon;
  }

  public double getLat() {
    return lat;
  }

  public void setLat(double lat) {
    this.lat = lat;
  }

  public double computeDistance(Location other){
    double dist = 0;
    return dist;
  }

}
