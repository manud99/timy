use clap::{Parser, Subcommand};

/// Serve command
#[derive(Parser)]
#[command(author, version, about, long_about=None)]
pub struct Cli {
    #[command(subcommand)]
    pub command: Option<Commands>,
}

#[derive(Subcommand)]
pub enum Commands {
    /// Serve the web app
    Serve {
        #[arg(short, long, default_value_t = 3000)]
        port: u16,
    },
}
