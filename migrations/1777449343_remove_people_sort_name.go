package migrations

import (
	"github.com/mattr/connexion/internal/people"
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId(people.CollectionName)
		if err != nil {
			return err
		}

		collection.Fields.RemoveByName("sort_name")
		return app.Save(collection)
	}, nil)
}
