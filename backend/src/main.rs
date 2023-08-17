use std::{io, net::SocketAddr, collections::HashMap};

use axum::{Router, routing::get, extract::Query};
use clap::Parser;

use colored::Colorize;
// use tokio::sync::oneshot::{channel, Sender};
// use percent_encoding::{percent_encode, NON_ALPHANUMERIC};
use serde::{Deserialize, Serialize};

mod cli;
use cli::{Cli, Commands};

mod server;
// use hyper::{Client, Uri, Request, Method};
use server::serve;

#[derive(Default, Serialize, Deserialize)]
struct MicrosoftConf {
    app_id: String,
    tenant: String,
    access_code: Option<String>,
}

#[tokio::main]
async fn main() {
    let cli = Cli::parse();

    match &cli.command {
        Some(Commands::Serve { port }) => {
            serve(port).await;
        }
        Some(Commands::MicrosoftConfig {}) => {
            println!("Set the config values for the Microsoft Graph API");
            println!("Values come from Azure Portal: https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps/ApplicationsListBlade");

            let mut config: MicrosoftConf = confy::load("timy", "microsoft").unwrap();

            println!("\nEnter your Application (client) ID: ");
            let app_id = &mut String::new();
            io::stdin().read_line(app_id).unwrap();
            config.app_id = app_id.trim().to_string();

            println!("\nEnter your tenant (common, organizations, consumers, or Tenant ID): ");
            let tenant = &mut String::new();
            io::stdin().read_line(tenant).unwrap();
            config.tenant = tenant.trim().to_string();

            confy::store("timy", "microsoft", config).unwrap();

            println!("\n{}", "Successfully stored the configuration.".green());
        }
        Some(Commands::MicrosoftAuthenticate {}) => {
            let config: MicrosoftConf = confy::load("timy", "microsoft").unwrap();

            let application_id = config.app_id;
            let tenant = config.tenant;

            let url = "https://login.microsoftonline.com/".to_owned()
                + &tenant 
                + "/oauth2/v2.0/authorize?client_id="
                + &application_id 
                + "&response_type=code&response_mode=query&scope=user.read%20Calendars.ReadWrite&state=1";
            println!("Open {:?}", url);

            // let (tx, rx) = channel::<()>();
            let app = Router::new().route("/microsoft/redirect", get(handle_redirect));
        
            async fn handle_redirect(Query(query): Query<HashMap<String, String>>) -> &'static str {
                println!("Received redirect request {:?}", query);
                if query.contains_key("code") {
                    // TODO: Use this access code to get an access token that can be used for future API calls and store this one.
                    // let access_code = query.get("code").unwrap().to_owned();

                    // println!("Successfully stored the new access token");

                    // TODO: Stop the web server after getting and storing an access token
                    // tx.send();
                } else {
                    println!("Could not extract code. Please try again!")
                }
        
                "You can close this tab now"
            }
            
            let addr = SocketAddr::from(([127, 0, 0, 1], 3000));
            println!("listening on {addr}");

            axum::Server::bind(&addr)
                .serve(app.into_make_service())
                // .with_graceful_shutdown(async {
                //     rx.await.ok();
                // })
                .await
                .unwrap();
            }
        None => {}
    }
}
