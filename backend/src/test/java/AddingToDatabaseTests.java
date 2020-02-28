package test.java;

import main.java.add.Add;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import java.sql.SQLException;

public class AddingToDatabaseTests {

    @Test
    public static void checkErrorThrownIfPathToDbNotInitialised(String[] args) {
        try {
            Add.add(args[1], Integer.parseInt(args[2]));
            Assertions.fail();
        } catch (SQLException e) {
            e.printStackTrace();
            Assertions.fail();
        } catch (InternalError e) {
            Assertions.assertEquals(e.getMessage(), "path to database has not been initialised");
        }
    }

    public static void main(String[] args) {
        checkErrorThrownIfPathToDbNotInitialised(args);
    }

}
