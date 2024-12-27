use axum::{extract::State, http::StatusCode, response::Html, routing::get, Router};
use handlebars::Handlebars;
use serde_json::json;
use std::fs;
use std::sync::Arc;
use tower_http::services::ServeDir;
use tower_http::trace::TraceLayer;
use tracing_subscriber::fmt::time::LocalTime;
use tracing_subscriber::prelude::__tracing_subscriber_SubscriberExt;
use tracing_subscriber::util::SubscriberInitExt;

struct AppState {
    html: String,
}

#[tokio::main]
async fn main() {
    let file =
        fs::File::create("server.log").expect("Should have been able to create server.log file");
    let console_layer = tracing_subscriber::fmt::layer()
        .with_timer(LocalTime::rfc_3339())
        .with_thread_ids(true)
        .with_target(false);
    let file_layer = tracing_subscriber::fmt::layer()
        .json()
        .with_writer(file)
        .with_timer(LocalTime::rfc_3339())
        .with_thread_ids(true)
        .with_target(false);
    tracing_subscriber::registry()
        .with(console_layer)
        .with(file_layer)
        .init();

    let gojoe_readme = fs::read_to_string("/Users/deepwater/code/gojoe/README.md")
        .expect("Should have been able to read gojoe README file");
    let gojoe_partial = markdown::to_html(gojoe_readme.as_str());

    let search_readme = fs::read_to_string("/Users/deepwater/code/search/search-engine/README.md")
        .expect("Should have been able to read search README file");
    let search_partial = markdown::to_html(search_readme.as_str());

    let deployer_readme = fs::read_to_string("/Users/deepwater/code/go/deploy/README.md")
        .expect("Should have been able to read deployer README file");
    let deployer_partial = markdown::to_html(deployer_readme.as_str());

    let argo_readme = fs::read_to_string("/Users/deepwater/code/argo/README.md")
        .expect("Should have been able to read Argo README file");
    let argo_partial = markdown::to_html(argo_readme.as_str());

    let data = json!({
        "gojoe_content": gojoe_partial,
        "search_content": search_partial,
        "deployer_content": deployer_partial,
        "argo_content": argo_partial,
    });
    let mut reg = Handlebars::new();
    reg.register_template_file(
        "index",
        "/Users/deepwater/code/gojoe/rust-server/static/index.html",
    )
    .expect("Should have been able to register index template");
    // reg.render_template(template_string, data);
    let rendered = reg
        .render("index", &data)
        .expect("Should have been able to render page");

    let shared_state = Arc::new(AppState { html: rendered });

    // build our application with a single route
    let app = Router::new()
        .route("/", get(handle_root))
        .with_state(shared_state)
        .nest_service("/static", ServeDir::new("static"))
        .layer(TraceLayer::new_for_http());

    // run our app with hyper, listening globally on port 3000
    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    tracing::info!("Listening on http://0.0.0.0:3000");
    axum::serve(listener, app).await.unwrap();
}

async fn handle_root(State(state): State<Arc<AppState>>) -> Result<Html<String>, StatusCode> {
    Ok(axum::response::Html(state.html.clone()))
    // Ok(state.html)
    // if let Ok(web_page) = fs::read_to_string("static/index.html") {
    //     Ok(Html(web_page))
    // } else {
    //     Err(StatusCode::NOT_FOUND)
    // }
}
