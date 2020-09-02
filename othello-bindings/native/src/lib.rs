use neon::prelude::*;
use othello_ai::mcts::Mcts;
use othello_ai::othello::{Game, Player};

declare_types! {
    pub class JsGame for Game {
        init(_cx) {
            Ok(Game::new())
        }

        method getBlackPieces(mut cx) {
            let this = cx.this();
            let black_pieces: u64 = {
                let guard = cx.lock();
                let x = this.borrow(&guard).black_pieces; x
            };

            Ok(cx.number(black_pieces as f64).upcast())
        }

        method getWhitePieces(mut cx) {
            let this = cx.this();
            let white_pieces: u64 = {
                let guard = cx.lock();
                let x = this.borrow(&guard).white_pieces; x
            };

            Ok(cx.number(white_pieces as f64).upcast())
        }

        method state(mut cx) {
            let this = cx.this();
            let state: Player = {
                let guard = cx.lock();
                let x = this.borrow(&guard).game_state(); x
            };

            match state {
                Player::Black => Ok(JsString::new(&mut cx, "black").upcast()),
                Player::White => Ok(JsString::new(&mut cx, "white").upcast()),
                Player::Tie => Ok(JsString::new(&mut cx, "tie").upcast()),
                Player::InProgress => Ok(JsString::new(&mut cx, "in_progress").upcast()),
            }
        }

        method resolvePlay(mut cx) {
            let mut this = cx.this();

            let play = cx.argument::<JsNumber>(0)?.value();
            {
                let guard = cx.lock();
                let mut game = this.borrow_mut(&guard);
                game.make_play(play as u8);
            }

            Ok(cx.undefined().upcast())
        }

        method generatePlays(mut cx) {
            let mut this = cx.this();

            let plays = {
                let guard = cx.lock();
                let game = this.borrow_mut(&guard);
                game.generate_plays()
            };

            let plays_js = JsArray::new(&mut cx, plays.len() as u32);
            // fill plays_js with plays
            for (i, obj) in plays.iter().enumerate() {
                let play = cx.number(*obj as f64);
                plays_js.set(&mut cx, i as u32, play)?;
            }

            Ok(plays_js.upcast())
        }

        method isValidPlay(mut cx) {
            let this = cx.this();

            let play = cx.argument::<JsNumber>(0)?.value();
            let is_valid = {
                let guard = cx.lock();
                let game = this.borrow(&guard);
                game.is_valid_play(play as u8)
            };

            let is_valid_js = JsBoolean::new(&mut cx, is_valid);

            Ok(is_valid_js.upcast())
        }

        method runSearch(mut cx) {
            let mut this = cx.this();

            let time_budget = cx.argument::<JsNumber>(0)?.value();

            let game = {
                let guard = cx.lock();
                let x = this.borrow_mut(&guard).clone(); x
            };

            let mut mcts = Mcts::new(game);
            let search_res = mcts.run_search(time_budget as u128);
            let best_play = mcts.best_play();

            let ret_js = JsObject::new(&mut cx);
            let best_play_js = JsNumber::new(&mut cx, best_play);
            let simulation_count_js = JsNumber::new(&mut cx, search_res.search_iterations);
            ret_js.set(&mut cx, "bestPlay", best_play_js)?;
            ret_js.set(&mut cx, "simulationCount", simulation_count_js)?;
            Ok(ret_js.upcast())
        }

        method toString(mut cx) {
            let this = cx.this();

            let string = {
                let guard = cx.lock();
                let x = format!("{}", *this.borrow(&guard)); x
            };

            let string_js = JsString::new(&mut cx, string);
            Ok(string_js.upcast())
        }
    }
}

register_module!(mut cx, { cx.export_class::<JsGame>("Game") });
