package migrations

import (
	"github.com/mattr/connexion/internal/contactmethods"
	"github.com/mattr/connexion/internal/people"
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		peopleCollection, err := app.FindCollectionByNameOrId(people.CollectionName)
		if err != nil {
			return err
		}

		collection := core.NewBaseCollection(contactmethods.CollectionName)

		collection.Fields.Add(&core.RelationField{
			Name:         contactmethods.FieldPerson,
			CollectionId: peopleCollection.Id,
			MaxSelect:    1,
			Required:     true,
		})
		collection.Fields.Add(&core.SelectField{
			Name:     contactmethods.FieldKind,
			Values:   contactmethods.Kinds,
			Required: true,
		})
		collection.Fields.Add(&core.TextField{
			Name: contactmethods.FieldLabel,
			Max:  255,
		})
		collection.Fields.Add(&core.TextField{
			Name:     contactmethods.FieldValue,
			Required: true,
			Max:      5000,
		})

		return app.Save(collection)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId(contactmethods.CollectionName)
		if err != nil {
			return err
		}

		return app.Delete(collection)
	})
}
