package migrations

import (
	"github.com/mattr/connexion/internal/memberships"
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId(memberships.CollectionName)
		if err != nil {
			return err
		}

		collection.AddIndex(
			memberships.IndexUniquePersonGroup,
			true,
			memberships.FieldPerson+", "+memberships.FieldGroup,
			"",
		)

		return app.Save(collection)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId(memberships.CollectionName)
		if err != nil {
			return err
		}

		collection.RemoveIndex(memberships.IndexUniquePersonGroup)

		return app.Save(collection)
	})
}
