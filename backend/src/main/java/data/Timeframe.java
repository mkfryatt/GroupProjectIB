package main.java.data;

public interface Timeframe {

  public int getStartTime();

  public void setStartTime(int startTime) ;

  public int getEndTime();

  public void setEndTime(int endTime);

  public default boolean overlaps(Timeframe other) {
    return this.getStartTime() <= other.getEndTime() && other.getStartTime() <= this.getEndTime();
  }

  //negative means other happens before this, positive means other happens afterwards
  public default int differenceTo(Timeframe other){
    if(this.overlaps(other)) return 0;
    else { //No overlap
      if(this.getStartTime() < other.getStartTime()){
        return other.getStartTime() - this.getEndTime();
      } else{
        return this.getStartTime() - other.getEndTime();
      }
    }
  }

}
