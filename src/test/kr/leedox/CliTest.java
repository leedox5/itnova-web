package kr.leedox;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import org.apache.commons.cli.CommandLine;
import org.apache.commons.cli.CommandLineParser;
import org.apache.commons.cli.DefaultParser;
import org.apache.commons.cli.HelpFormatter;
import org.apache.commons.cli.Option;
import org.apache.commons.cli.Options;
import org.apache.commons.cli.ParseException;
import org.junit.Test;

public class CliTest {

    @Test
    public void optionTest() {
        Options options = new Options().addOption("v", "verbose", false, "Verbose");
        Option option = Option.builder("d").longOpt("delim").hasArg(true).desc("The delimiter to use")
                .argName("delimiter").build();

        options.addOption(option);

        String[] args = new String[] { "-v", "-d=|", "1000", "TERM" };

        CommandLineParser parser = new DefaultParser();

        try {
            CommandLine cmdLine = parser.parse(options, args);
            if (cmdLine.hasOption("v")) {
                System.err.println("Running in verbos mode");
            }
            String delimiter = cmdLine.getOptionValue("d", ",");
            String result = String.join(delimiter, cmdLine.getArgs());
            System.out.println(result);
        } catch (ParseException e) {
            new HelpFormatter().printHelp("apache args...", options);
        }

        assertThatThrownBy(() -> {
            throw new Exception("boom!");
        }).isInstanceOf(Exception.class).hasMessageContaining("boom");

    }
}
