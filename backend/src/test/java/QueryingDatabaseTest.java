package test.java;

import database.DatabaseConnector;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.Assertions;
import main.java.add.Add;

import javax.xml.crypto.Data;
import java.sql.ResultSet;
import java.sql.SQLException;

public class QueryingDatabaseTest {
    public static DatabaseConnector dbCon = new DatabaseConnector("C:\\Users\\keval\\Documents\\Cambridge\\Part " +
            "1B\\Group Project\\Juliet\\backend\\database.db");

    @Test
    public static void queryUnepReps() throws SQLException {
        int repNumber = 0;
        ResultSet rsUnepReps = dbCon.executeQuery("SELECT * FROM unep_reps");
        while(rsUnepReps.next()) {
            repNumber += 1;
        }
        System.out.println(repNumber);
        Assertions.assertEquals(repNumber, 5);
    }

    public static void addUnepPresence() {
        // check number of aggr_unep_presences
        // add unep presence
        // check number of aggr_unep_presences after and see if it increased

    }



    public static void main(String[] args) throws SQLException {
        System.out.println("hello");
        queryUnepReps();
    }
}
