package main

import (
	"log"
	"os"

	_ "github.com/mattr/connexion/migrations"

	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/plugins/migratecmd"
	"github.com/pocketbase/pocketbase/tools/osutils"
)

func main() {
	app := newApp()

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}

func newApp() *pocketbase.PocketBase {
	return newAppWithConfig(pocketbase.Config{})
}

func newAppWithConfig(config pocketbase.Config) *pocketbase.PocketBase {
	app := pocketbase.NewWithConfig(config)

	migratecmd.MustRegister(app, app.RootCmd, migratecmd.Config{
		Automigrate: osutils.IsProbablyGoRun(),
	})

	app.OnBootstrap().BindFunc(func(e *core.BootstrapEvent) error {
		if err := e.Next(); err != nil {
			return err
		}

		if isMigrateCommand(os.Args) {
			return nil
		}

		return e.App.RunAppMigrations()
	})

	app.OnServe().BindFunc(func(se *core.ServeEvent) error {
		// serves static files from the provided public dir (if exists)
		se.Router.GET("/{path...}", apis.Static(os.DirFS("./pb_public"), false))

		return se.Next()
	})

	return app
}

func isMigrateCommand(args []string) bool {
	for _, arg := range args[1:] {
		if arg == "migrate" {
			return true
		}
	}

	return false
}
