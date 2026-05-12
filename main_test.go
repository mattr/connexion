package main

import (
	"slices"
	"testing"

	"github.com/pocketbase/pocketbase/tools/dbutils"

	"github.com/mattr/connexion/internal/contactmethods"
	"github.com/mattr/connexion/internal/groups"
	"github.com/mattr/connexion/internal/memberships"
	"github.com/mattr/connexion/internal/people"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
)

func TestIsMigrateCommand(t *testing.T) {
	t.Parallel()

	tests := []struct {
		name string
		args []string
		want bool
	}{
		{
			name: "serve command",
			args: []string{"connexion", "serve"},
			want: false,
		},
		{
			name: "migrate command",
			args: []string{"connexion", "migrate"},
			want: true,
		},
		{
			name: "migrate subcommand",
			args: []string{"connexion", "migrate", "up"},
			want: true,
		},
		{
			name: "global flag before migrate",
			args: []string{"connexion", "--dir", "/tmp/connexion", "migrate", "down", "1"},
			want: true,
		},
		{
			name: "no command",
			args: []string{"connexion"},
			want: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			t.Parallel()

			got := isMigrateCommand(tt.args)
			if got != tt.want {
				t.Fatalf("isMigrateCommand(%v) = %t, want %t", tt.args, got, tt.want)
			}
		})
	}
}

func TestNewApp(t *testing.T) {
	t.Parallel()

	app := newApp()
	if app == nil {
		t.Fatal("newApp() returned nil")
	}

	if app.RootCmd == nil {
		t.Fatal("newApp() did not initialize RootCmd")
	}

	if _, _, err := app.RootCmd.Find([]string{"migrate"}); err != nil {
		t.Fatalf("newApp() did not register migrate command: %v", err)
	}
}

func TestPeopleMigration(t *testing.T) {
	t.Parallel()

	app := newAppWithConfig(pocketbase.Config{
		DefaultDataDir: t.TempDir(),
		DefaultDev:     false,
	})
	t.Cleanup(func() {
		if err := app.ResetBootstrapState(); err != nil {
			t.Errorf("ResetBootstrapState() returned error: %v", err)
		}
	})

	if err := app.Bootstrap(); err != nil {
		t.Fatalf("Bootstrap() returned error: %v", err)
	}

	collection, err := app.FindCollectionByNameOrId(people.CollectionName)
	if err != nil {
		t.Fatalf("FindCollectionByNameOrId(%q) returned error: %v", people.CollectionName, err)
	}

	assertTextField(t, collection, people.FieldName, true)
	assertTextField(t, collection, people.FieldNickname, false)
	assertNoField(t, collection, "sort_name")
	assertAuthenticatedRules(t, collection)
}

func assertNoField(t *testing.T, collection *core.Collection, name string) {
	t.Helper()

	if field := collection.Fields.GetByName(name); field != nil {
		t.Fatalf("field %q exists, want no field", name)
	}
}

func TestContactMethodsMigration(t *testing.T) {
	t.Parallel()

	app := newAppWithConfig(pocketbase.Config{
		DefaultDataDir: t.TempDir(),
		DefaultDev:     false,
	})
	t.Cleanup(func() {
		if err := app.ResetBootstrapState(); err != nil {
			t.Errorf("ResetBootstrapState() returned error: %v", err)
		}
	})

	if err := app.Bootstrap(); err != nil {
		t.Fatalf("Bootstrap() returned error: %v", err)
	}

	peopleCollection, err := app.FindCollectionByNameOrId(people.CollectionName)
	if err != nil {
		t.Fatalf("FindCollectionByNameOrId(%q) returned error: %v", people.CollectionName, err)
	}

	collection, err := app.FindCollectionByNameOrId(contactmethods.CollectionName)
	if err != nil {
		t.Fatalf("FindCollectionByNameOrId(%q) returned error: %v", contactmethods.CollectionName, err)
	}

	assertRelationField(t, collection, contactmethods.FieldPerson, peopleCollection.Id, true)
	assertSelectField(t, collection, contactmethods.FieldKind, contactmethods.Kinds, true)
	assertTextField(t, collection, contactmethods.FieldLabel, false)
	assertTextFieldWithMax(t, collection, contactmethods.FieldValue, true, 5000)
	assertAuthenticatedRules(t, collection)
}

func TestGroupsAndMembershipsMigration(t *testing.T) {
	t.Parallel()

	app := newAppWithConfig(pocketbase.Config{
		DefaultDataDir: t.TempDir(),
		DefaultDev:     false,
	})
	t.Cleanup(func() {
		if err := app.ResetBootstrapState(); err != nil {
			t.Errorf("ResetBootstrapState() returned error: %v", err)
		}
	})

	if err := app.Bootstrap(); err != nil {
		t.Fatalf("Bootstrap() returned error: %v", err)
	}

	peopleCollection, err := app.FindCollectionByNameOrId(people.CollectionName)
	if err != nil {
		t.Fatalf("FindCollectionByNameOrId(%q) returned error: %v", people.CollectionName, err)
	}

	groupsCollection, err := app.FindCollectionByNameOrId(groups.CollectionName)
	if err != nil {
		t.Fatalf("FindCollectionByNameOrId(%q) returned error: %v", groups.CollectionName, err)
	}
	assertTextField(t, groupsCollection, groups.FieldName, true)
	assertTextFieldWithMax(t, groupsCollection, groups.FieldDescription, false, 5000)
	assertAuthenticatedRules(t, groupsCollection)

	membershipsCollection, err := app.FindCollectionByNameOrId(memberships.CollectionName)
	if err != nil {
		t.Fatalf("FindCollectionByNameOrId(%q) returned error: %v", memberships.CollectionName, err)
	}
	assertRelationField(t, membershipsCollection, memberships.FieldPerson, peopleCollection.Id, true)
	assertRelationField(t, membershipsCollection, memberships.FieldGroup, groupsCollection.Id, true)
	assertTextFieldWithMax(t, membershipsCollection, memberships.FieldNote, false, 5000)
	assertUniqueIndex(t, membershipsCollection, memberships.IndexUniquePersonGroup, memberships.FieldPerson, memberships.FieldGroup)
	assertAuthenticatedRules(t, membershipsCollection)
}

func assertUniqueIndex(t *testing.T, collection *core.Collection, name string, columns ...string) {
	t.Helper()

	index := dbutils.ParseIndex(collection.GetIndex(name))
	if !index.Unique {
		t.Fatalf("index %q Unique = false, want true", name)
	}

	if len(index.Columns) != len(columns) {
		t.Fatalf("index %q has %d columns, want %d", name, len(index.Columns), len(columns))
	}

	for i, column := range columns {
		if index.Columns[i].Name != column {
			t.Fatalf("index %q column %d = %q, want %q", name, i, index.Columns[i].Name, column)
		}
	}
}

func assertAuthenticatedRules(t *testing.T, collection *core.Collection) {
	t.Helper()

	const authenticatedRule = "@request.auth.id != ''"

	rules := map[string]*string{
		"ListRule":   collection.ListRule,
		"ViewRule":   collection.ViewRule,
		"CreateRule": collection.CreateRule,
		"UpdateRule": collection.UpdateRule,
		"DeleteRule": collection.DeleteRule,
	}

	for name, rule := range rules {
		if rule == nil {
			t.Fatalf("%s is nil, want %q", name, authenticatedRule)
		}

		if *rule != authenticatedRule {
			t.Fatalf("%s = %q, want %q", name, *rule, authenticatedRule)
		}
	}
}

func assertTextField(t *testing.T, collection *core.Collection, name string, required bool) {
	t.Helper()

	assertTextFieldWithMax(t, collection, name, required, 255)
}

func assertTextFieldWithMax(t *testing.T, collection *core.Collection, name string, required bool, max int) {
	t.Helper()

	field, ok := collection.Fields.GetByName(name).(*core.TextField)
	if !ok {
		t.Fatalf("field %q is not a text field", name)
	}

	if field.Required != required {
		t.Fatalf("field %q Required = %t, want %t", name, field.Required, required)
	}

	if field.Max != max {
		t.Fatalf("field %q Max = %d, want %d", name, field.Max, max)
	}
}

func assertRelationField(t *testing.T, collection *core.Collection, name string, collectionID string, required bool) {
	t.Helper()

	field, ok := collection.Fields.GetByName(name).(*core.RelationField)
	if !ok {
		t.Fatalf("field %q is not a relation field", name)
	}

	if field.CollectionId != collectionID {
		t.Fatalf("field %q CollectionId = %q, want %q", name, field.CollectionId, collectionID)
	}

	if field.Required != required {
		t.Fatalf("field %q Required = %t, want %t", name, field.Required, required)
	}

	if !field.CascadeDelete {
		t.Fatalf("field %q CascadeDelete = false, want true", name)
	}

	if field.MaxSelect != 1 {
		t.Fatalf("field %q MaxSelect = %d, want 1", name, field.MaxSelect)
	}
}

func assertSelectField(t *testing.T, collection *core.Collection, name string, values []string, required bool) {
	t.Helper()

	field, ok := collection.Fields.GetByName(name).(*core.SelectField)
	if !ok {
		t.Fatalf("field %q is not a select field", name)
	}

	if field.Required != required {
		t.Fatalf("field %q Required = %t, want %t", name, field.Required, required)
	}

	if !slices.Equal(field.Values, values) {
		t.Fatalf("field %q Values = %v, want %v", name, field.Values, values)
	}
}
