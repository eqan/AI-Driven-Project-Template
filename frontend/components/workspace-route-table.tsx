"use client";

import NextLink from "next/link";
import { Table } from "@heroui/react";

import type { ProductArea } from "@/types";

type WorkspaceRouteTableProps = {
  areas: ProductArea[];
};

export function WorkspaceRouteTable({ areas }: WorkspaceRouteTableProps) {
  return (
    <Table
      className="rounded-3xl border border-[var(--line)] bg-[var(--surface)] shadow-[0_14px_44px_rgba(2,6,23,0.12)]"
      variant="secondary"
    >
      <Table.ScrollContainer className="w-full">
        <Table.Content aria-label="Frontend routes and the product jobs they own">
          <Table.Header>
            <Table.Column isRowHeader>Route</Table.Column>
            <Table.Column>Status</Table.Column>
            <Table.Column>Current use</Table.Column>
            <Table.Column>Team outcome</Table.Column>
          </Table.Header>
          <Table.Body renderEmptyState={() => "No routes have been mapped yet."}>
            {areas.map((area) => (
              <Table.Row id={area.href} key={area.href}>
                <Table.Cell>
                  <div className="flex min-w-[180px] flex-col gap-1">
                    <span className="font-semibold text-foreground">{area.title}</span>
                    <NextLink
                      className="text-sm font-medium text-accent transition-colors hover:text-accent/80"
                      href={area.href}
                    >
                      Open route
                    </NextLink>
                  </div>
                </Table.Cell>
                <Table.Cell>{area.status}</Table.Cell>
                <Table.Cell>{area.description}</Table.Cell>
                <Table.Cell>{area.outcome}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  );
}
