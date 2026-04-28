package migrations

import (
	"github.com/mattr/connexion/internal/people"
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		collection := core.NewBaseCollection(people.CollectionName)

		collection.Fields.Add(&core.TextField{
			Name:        people.FieldName,
			Required:    true,
			Presentable: true,
			Max:         255,
		})
		collection.Fields.Add(&core.TextField{
			Name: people.FieldSortName,
			Max:  255,
		})
		collection.Fields.Add(&core.TextField{
			Name: people.FieldNickname,
			Max:  255,
		})

		return app.Save(collection)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId(people.CollectionName)
		if err != nil {
			return err
		}

		return app.Delete(collection)
	})
}
