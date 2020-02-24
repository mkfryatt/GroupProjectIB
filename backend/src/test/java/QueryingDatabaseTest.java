package test.java;

import org.junit.jupiter.api.Test;
import main.java.add.Add;

import java.sql.ResultSet;
import java.sql.SQLException;

public class QueryingDatabaseTest {
    @Test
    public static void queryUnepReps() throws SQLException {
        ResultSet unepReps = Add.dbCon.executeQuery("SELECT * FROM unep_reps");
        while(unepReps.next()) {
            System.out.println(unepReps.getString("firstName"));
        }
    }
}
