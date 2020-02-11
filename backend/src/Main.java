import database.DatabaseConnector;
import data.*;

public class Main {
  public static void main(String[] args) {
    DatabaseConnector dbc = new DatabaseConnector("database.db");
    DataManager dm = new DataManager();
    dm.loadDatabase(dbc);

    System.out.println("done");
  }

}
