package database;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Statement;

public class DatabaseController {

  Connection conn;

  public DatabaseController(String filePath) {
    try {
      String url = "jdbc:sqlite:" + filePath;
      conn = DriverManager.getConnection(url);
      if (conn != null) {
        DatabaseMetaData meta = conn.getMetaData();
        System.out.println("Driver name is" + meta.getDriverName());
      }
    } catch (SQLException e) {
      e.printStackTrace();
    }
  }

  private void executeStatement(String statement) {
    try {
      Statement stmt = conn.createStatement();
      stmt.execute(statement);
    } catch (SQLException e) {
      e.printStackTrace();
    }
  }

  public void createTables(String textPath) {
    String tableFile = "";
    try {
      tableFile = new String(Files.readAllBytes(Paths.get(textPath)));
    } catch (IOException e) {
      e.printStackTrace();
      return;
    }

    String[] tables = tableFile.split("\\n\\n");
    for (String s : tables) {
      System.out.println(s);
      executeStatement("CREATE TABLE IF NOT EXISTS " + s);
    }
  }

  public void testInsert() {
    String sql = "INSERT INTO unep_reps(firstName,lastName) VALUES(?,?)";
    try {
      PreparedStatement pstmt = conn.prepareStatement(sql);
      pstmt.setString(1, "Franz");
      pstmt.setString(2,"Smith");
      pstmt.executeUpdate();
    } catch (SQLException e) {
      e.printStackTrace();
    }
  }

  public static void main(String[] args) {
    DatabaseController dbCon = new DatabaseController("db/database.db");
    dbCon.createTables("db/tables.txt");
    dbCon.testInsert();
  }
}
