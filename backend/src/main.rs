use clap::Parser;

mod cli;
use cli::{Cli, Commands};

mod server;
use server::serve;

#[tokio::main]
async fn main() {
    let cli = Cli::parse();

    match &cli.command {
        Some(Commands::Serve { port }) => {
            serve(port).await;
        }
        None => {}
    }
}
