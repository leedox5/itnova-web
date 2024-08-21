package kr.leedox;

import org.apache.commons.cli.CommandLine;
import org.apache.commons.cli.CommandLineParser;
import org.apache.commons.cli.DefaultParser;
import org.apache.commons.cli.HelpFormatter;
import org.apache.commons.cli.Option;
import org.apache.commons.cli.Options;
import org.apache.commons.cli.ParseException;

public class PkgtUtil {
    public static void main(String[] args) {
        Options options = new Options();
        Option option1 = Option.builder("c").longOpt("come").hasArg(true).desc("ex) TERM").argName("COME")
                .required(true).build();
        Option option2 = Option.builder("p").longOpt("pkgt").hasArg(true).desc("ex) CATBTERT").argName("PKGT")
                .required(true).build();
        Option option3 = Option.builder("d").longOpt("degr").hasArg(true).desc("ex) 16-4").argName("DEGR")
                .required(true).build();

        options.addOption(option1);
        options.addOption(option2);
        options.addOption(option3);

        CommandLineParser parser = new DefaultParser();

        try {
            CommandLine cmdLine = parser.parse(options, args);
            String come = cmdLine.getOptionValue("c");
            String pkgt = cmdLine.getOptionValue("p");
            String degr = cmdLine.getOptionValue("d");

            System.out.println("> COME: " + come);
            System.out.println("> PKGT: " + pkgt);
            System.out.println("> DEGR: " + degr);

            PkgtUpdater pkgtUpdater = new PkgtUpdater(come, pkgt, degr);
            pkgtUpdater.execute();

        } catch (ParseException e) {
            new HelpFormatter().printHelp("PkgtUtil args...", options);
            System.exit(1);
        }

        // System.exit(0);
    }
}
