package migrations

import (
	"github.com/mattr/connexion/internal/contactmethods"
	"github.com/mattr/connexion/internal/people"
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
	"github.com/pocketbase/pocketbase/tools/types"
)

func init() {
	m.Register(func(app core.App) error {
		for _, name := range []string{people.CollectionName, contactmethods.CollectionName} {
			collection, err := app.FindCollectionByNameOrId(name)
			if err != nil {
				return err
			}

			collection.ListRule = types.Pointer(authenticatedRule)
			collection.ViewRule = types.Pointer(authenticatedRule)
			collection.CreateRule = types.Pointer(authenticatedRule)
			collection.UpdateRule = types.Pointer(authenticatedRule)
			collection.DeleteRule = types.Pointer(authenticatedRule)

			if err := app.Save(collection); err != nil {
				return err
			}
		}

		collection, err := app.FindCollectionByNameOrId(contactmethods.CollectionName)
		if err != nil {
			return err
		}

		field, ok := collection.Fields.GetByName(contactmethods.FieldPerson).(*core.RelationField)
		if !ok {
			return nil
		}

		field.CascadeDelete = true
		return app.Save(collection)
	}, nil)
}
